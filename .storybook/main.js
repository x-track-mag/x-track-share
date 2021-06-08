const path = require("path");
const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
	stories: [
		"../src/components/**/*.stories.mdx",
		"../src/components/**/*.stories.@(js|jsx|ts|tsx)"
		// "../src/stories/**/*.stories.mdx",
		// "../src/stories/**/*.stories.@(js|jsx|ts|tsx)"
	],
	reactOptions: {
		fastRefresh: true
	},
	addons: ["@storybook/addon-actions", "@storybook/addon-essentials"],
	webpackFinal: async (baseConfig) => {
		// merge whatever from nextConfig into the webpack config storybook will use
		// this include important things like aliases on @components, @lib...
		const nextConfig = require("../next.config.js");
		const mergedWebpackConfig = nextConfig.webpack(baseConfig);
		console.dir(mergedWebpackConfig);
		return {
			...mergedWebpackConfig,
			resolve: {
				...mergedWebpackConfig.resolve,
				alias: {
					...mergedWebpackConfig.resolve.alias,
					"@emotion/core": toPath("node_modules/@emotion/react"),
					"emotion-theming": toPath("node_modules/@emotion/react")
				}
			}
		};
	}
};
