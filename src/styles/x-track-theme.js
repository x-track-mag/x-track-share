import "@fontsource/archivo/800.css";

export const fonts = {
    heading: `'Conduit ITC W04 Regular', Archivo, sans`, // Conduit ITC W02 Bold
    body: `'Conduit ITC W04 Regular', Raleway`
};

export const breakpoints = {
    xs: "320px",
    sm: "420px",
    md: "768px",
    lg: "1080px",
    xl: "1400px"
};

export const colors = {
    brand: {
        black: "#000",
        blue: "#00F",
        yellow: "#FF0",
        white: "#FFF"
    }
};

export const global = {
    html: {
        fontSize: {
            sm: "18px",
            md: "20px",
            lg: "22px",
            xl: "24px"
        }
    },
    body: {
        minWidth: "480px",
        overflowX: "hidden",
        color: "brand.yellow",
        backgroundColor: "black",
        "p, h1, h2, h3, h4": {
            "&::selection": {
                color: "brand.blue",
                backgroundColor: "brand.yellow"
            }
        },
        "h1, h2, h3, h4": {
            textTransform: "uppercase",
            fontWeight: 600
        },
        a: {
            textDecoration: "underline"
        }
    }
};

export const components = {
    Progress: {
        variants: {
            "x-track": {
                bg: "gray.700",
                bgColor: "#ff0"
            }
        }
    }
};
