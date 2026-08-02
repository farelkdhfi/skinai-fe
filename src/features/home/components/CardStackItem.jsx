import {
    motion,
} from 'framer-motion';


const CardStackItem = ({ data, index }) => {
    return (
        <div className="sticky top-40 mb-20 md:mb-40 last:mb-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className={`${data.color} rounded-[2.5rem] p-4 md:p-8 grid md:grid-cols-2 shadow-xl bg-neutral-900 relative overflow-hidden h-[500px]`}
            >
                <div className="relative z-10">
                    <h1 className='font-bold text-8xl text-neutral-600 mb-4'>{data.num}</h1>
                    <h3 className="md:text-3xl text-2xl font-medium md:mb-4">{data.title}</h3>
                    <p className="text-neutral-600 md:text-lg text-sm max-w-sm">{data.desc}</p>
                </div>
                <div className="relative md:absolute mt-4 md:mt-0 right-0 bottom-0 w-full md:w-1/2 h-full md:h-full rounded-tl-[3rem] overflow-hidden">
                    <>
                        {/* Fix: Added absolute, inset-0, and z-10 to overlay */}
                        <div className='absolute inset-0 bg-linear-to-t from-black/90 to-transparent z-10' />

                        {data.isVideo ? (
                            <video src={data.img} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                        ) : (
                            <img src={data.img} alt={data.title} className="w-full h-full object-cover" />
                        )}
                    </>
                </div>
            </motion.div>
        </div>
    );
};

export default CardStackItem;