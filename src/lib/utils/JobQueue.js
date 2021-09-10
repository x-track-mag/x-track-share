import EventEmitter from "./EventEmitter";

/**
 * @typedef JobQueue
 * @property {Function} addBatch
 * @property {Function} on
 * @property {Function} clear
 */

/**
 * @typedef QueueProps
 * @property {Function} worker
 * @property {Number} [concurrency=10] Maximum number of allowed concurrent jobs
 * @property {Function} [retries=3] How many times should we retry if a job fails ?
 */

/**
 * JobQueue instanciation
 * @typedef {QueueProps} props
 * @returns {JobQueue}
 */
function JobQueue({ worker, concurrency = 8, retries = 3 }) {
	const pending = [];
	const active = new Set();
	let running = false;
	const jobEvents = new EventEmitter();
	const emit = jobEvents.emit.bind(jobEvents);
	const on = jobEvents.on.bind(jobEvents);

	const consume = async () => {
		if (pending.length === 0) {
			running = false;
			emit("complete");
			return;
		}

		if (active.size >= concurrency) {
			return;
		} else {
			const current = pending.shift();
			active.add(current);
			running = true;

			console.log("Staring Job", current);
			worker(current.payload, current.batchIndex)
				.then((result) => {
					current.success = result;
					emit("success", current);
					active.delete(current);
					consume();
				})
				.catch((err) => {
					console.log("Job failed", current);
					console.error(err);
					if (current.retries > 0) {
						current.retries--;
						emit("retrying", current, err);
						active.delete(current);
						pending.push(current);
					} else {
						current.success = false;
						current.error = err.message;
						emit("failure", current, err);
						active.delete(current);
					}
					consume();
				});
			consume();
		}
	};

	// Pushing new jobs can be done even when the queue is running
	const push = (jobs) => {
		pending.push(...jobs);
		console.log(`Added ${jobs.length} to the queue`, pending);
		consume();
	};

	/**
	 *
	 * @param  {Array<Any>} jobs
	 * @returns {Promise}
	 */
	const runBatch = (jobs) => {
		if (!Array.isArray(jobs)) {
			throw new TypeError("runBatch() must be providden an array of jobs payload");
		}
		console.log(`runBatch()`, jobs);
		// Wrap all these jobs inside a container to keep track of their failure or success
		const batch = jobs.map((job, i) => ({
			payload: job,
			batchIndex: i,
			retries: retries
		}));
		return new Promise((resolve) => {
			const completed = () => {
				resolve(batch);
				jobEvents.off("completed", completed); // UN-REGISTER OUR EVENT HANDLER
			};
			jobEvents.on("complete", completed);
			push(batch);
		});
	};

	const clear = () => {
		running = false;
		pending = [];
		active.clear();
		jobEvents.clearEvents();
	};

	return {
		push,
		runBatch,
		on
	};
}

export default JobQueue;
