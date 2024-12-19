import Footer from "./footer";
import { Header1 } from "./header";
import NavBar from "./navbar";

export default function PageWrapper({ children }) {
	return (
		<>
			<Header1 />
			<main className="flex min-w-screen min-h-screen flex-col pt-[4rem] items-center dark:bg-black bg-white justify-between">
				<div className="absolute z-[-99] pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
				{children}
			</main>
			<Footer />
		</>
	);
}
