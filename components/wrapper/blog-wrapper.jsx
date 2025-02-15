import Footer from "./footer";
import { Header1 } from "./header";

export function BlogWrapper({ children }) {
	return (
		<>
			<Header1 />
			<main className="flex min-w-screen min-h-screen flex-col pt-[4rem] items-center dark:bg-black bg-white justify-between isolate">
				{children}
			</main>
			<Footer />
		</>
	);
}
