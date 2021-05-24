function Error({ statusCode, message }) {
	return (
		<h1>
			<code>{statusCode}</code> | <span className="error">{message}</span>
		</h1>
	);
}

Error.getInitialProps = ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode, message: err.message };
};

export default Error;
