import EventEmitter from "./EventEmitter";

/**
 * @typedef JobQueue
 * @property {Function} addBatch
 * @property {Function} on
 * @property {Function} clear
 */

/**
 * JobQueue instanciation
 * @typedef {QueueProps} props
 * @returns {JobQueue}
 */

function JobQueue({ worker, concurrency = 3, retries = 3 }) {
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
					current.result = result;
					emit("success", current);
					active.delete(current);
				})
				.catch((err) => {
					console.log("Job failed", current);
					console.error(err);
					if (current.retries > 0) {
						current.retries--;
						emit("retrying", current, err);
						active.delete(current);
						pending.push(current);
						// consume();
					} else {
						current.failure = err;
						emit("failure", current, err);
						active.delete(current);
						// consume();
					}
				});
			consume();
		}
	};

	// Pushing new jobs can be done even when the queue is running
	const push = (jobs) => {
		pending.push(
			...jobs.map((job, i) => ({ payload: job, batchIndex: i, retries: retries }))
		);
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
		const allJobs = [...jobs]; // Make a copy of all the jobs
		return new Promise((resolve) => {
			const completed = () => {
				resolve(allJobs);
				jobEvents.off("completed", completed); // UN-REGISTER OUR EVENT HANDLER
			};
			jobEvents.on("complete", completed);
			push(jobs);
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
