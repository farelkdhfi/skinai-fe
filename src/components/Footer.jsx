const Footer = () => {
    return (
        <footer className="bg-white py-3 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold tracking-tight">SKinAI.</div>
            <p className="text-neutral-500 text-sm text-center">Penelitian Skripsi Teknik Informatika - Universitas Siliwangi.</p>
            <div className="flex gap-6 text-sm font-medium">
                <a href="#" className="hover:underline">Github</a>
                <a href="#" className="hover:underline">Paper</a>
            </div>
        </footer>
    )
}
export default Footer;