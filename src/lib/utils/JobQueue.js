import EventEmitter from "./EventEmitter";

function JobQueue({ worker, concurrency = 3, retries = 3 }) {
	const pending = [];
	const active = new Set();
	const running = false;
	const { emit, off, on, clearEvents } = new EventEmitter();

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

			worker(current.payload)
				.then((result) => {
					current.result = result;
					emit("success", current);
					active.delete(current);
					consume();
				})
				.catch((err) => {
					if (current.retries > 0) {
						current.retries--;
						emit("retrying", current, err);
						active.delete(current);
						pending.push(current);
						consume();
					} else {
						current.failure = err;
						emit("failure", current, err);
						active.delete(current);
						consume();
					}
				});
		}
	};

	// Pushing new jobs can be done even when the queue is running
	const push = (...jobs) => {
		if (jobs.length === 0) {
			return;
		}
		pending.push(jobs.map((job) => ({ payload: job, retries: retries })));
		consume();
	};

	/**
	 *
	 * @param  {...any} jobs
	 * @returns {Promise}
	 */
	const runBatch = (...jobs) => {
		const allJobs = [...jobs]; // Make a copy of all the jobs
		return new Promise((resolve) => {
			const completed = () => {
				resolve(allJobs);
				off("completed", completed); // UN-REGISTER OUR EVENT HANDLER
			};
			on("complete", completed);
			push(...jobs);
		});
	};

	const clear = () => {
		running = false;
		pending = [];
		active.clear();
		clearEvents();
	};

	return {
		push,
		runBatch,
		on
	};
}

export default JobQueue;
