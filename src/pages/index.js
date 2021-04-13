import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { Footer } from "../components/Footer";

const Index = () => (
	<Container height="100vh" bg="blue">
		<Hero />
		<Main></Main>

		<Footer />
	</Container>
);

export default Index;
