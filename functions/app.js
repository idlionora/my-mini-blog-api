const express = require('express');

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

const getBlogposts = (req, res) => {
	res.status(200).json({ status: 'success', results: 'data.length', data: 'hello!' });
};

app.route('/api/v1/blogposts').get(getBlogposts);

const port = 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
