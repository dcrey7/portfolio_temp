// Custom CSS for taller tile and navigation buttons
const customStyles = `
.tile-tall {
    height: 300px;
}
@media (max-width: 640px) {
    .tile-tall {
        height: 250px;
    }
}

.tile {
    border-radius: 17px;
    overflow: hidden;
}

.carousel-container {
    position: relative;
    padding: 0 50px;
}
.nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}
.nav-button-left {
    left: 0px;
}
.nav-button-right {
    right: 0px;
}
@media (max-width: 640px) {
    .nav-button {
        display: none;
    }
    .carousel-container {
        padding: 0 10px;
    }
}
`;

const FeatureTile = ({ icon, title, className, style }) => (
    <div className={`tile p-4 shadow-md flex flex-col items-center justify-center text-white ${className}`} style={style}>
        <div className="text-3xl sm:text-4xl mb-2">{icon}</div>
        <span className="text-sm sm:text-base text-center">{title}</span>
    </div>
);

const CarouselPage = ({ title, features }) => (
    <div className="w-full px-2 sm:px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {features.map((feature, index) => (
                <FeatureTile key={index} {...feature} />
            ))}
        </div>
    </div>
);

const FeatureCarousel = () => {
    const [currentPage, setCurrentPage] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const [touchStart, setTouchStart] = React.useState(null);
    const [touchEnd, setTouchEnd] = React.useState(null);

    const pages = [
        {
            title: "iPhone Features",
            features: [
                { icon: "🔋", title: "No battery life", className: "col-span-1" },
                { icon: "💡", title: "Brighter flash", className: "col-span-1" },
                { icon: "📱", title: '2.2" and 9.1"', className: "col-span-1" },
                { icon: "🎨", title: "Five new colours", className: "col-span-1" },
                { icon: "📱", title: "iPhone", className: "col-span-1 sm:col-span-2 tile-tall", style: { backgroundImage: 'url("/api/placeholder/400/300")', backgroundSize: 'cover', backgroundPosition: 'center' } },
                { icon: "5G", title: "5G", className: "col-span-1" },
                { icon: "📏", title: "2% smaller notch", className: "col-span-1" },
                { icon: "🖐️", title: "Easier to hold", className: "col-span-1" },
                { icon: "A15", title: "A15 Bionic", className: "col-span-1" },
            ]
        },
        // Add more pages as needed
		{
            title: "IPAD",
            features: [
                { icon: "🔋", title: "No battery life", className: "col-span-1" },
                { icon: "💡", title: "Brighter flash", className: "col-span-1" },
                { icon: "📱", title: '2.2" and 9.1"', className: "col-span-1" },
                { icon: "🎨", title: "Five new colours", className: "col-span-1" },
                { icon: "📱", title: "iPhone", className: "col-span-1 sm:col-span-2 tile-tall", style: { backgroundImage: 'url("/api/placeholder/400/300")', backgroundSize: 'cover', backgroundPosition: 'center' } },
                { icon: "5G", title: "5G", className: "col-span-1" },
                { icon: "📏", title: "2% smaller notch", className: "col-span-1" },
                { icon: "🖐️", title: "Easier to hold", className: "col-span-1" },
                { icon: "A15", title: "A15 Bionic", className: "col-span-1" },
            ]
        },
		{
            title: "MAC",
            features: [
                { icon: "🔋", title: "No battery life", className: "col-span-1" },
                { icon: "💡", title: "Brighter flash", className: "col-span-1" },
                { icon: "📱", title: '2.2" and 9.1"', className: "col-span-1" },
                { icon: "🎨", title: "Five new colours", className: "col-span-1" },
                { icon: "📱", title: "iPhone", className: "col-span-1 sm:col-span-2 tile-tall", style: { backgroundImage: 'url("/api/placeholder/400/300")', backgroundSize: 'cover', backgroundPosition: 'center' } },
                { icon: "5G", title: "5G", className: "col-span-1" },
                { icon: "📏", title: "2% smaller notch", className: "col-span-1" },
                { icon: "🖐️", title: "Easier to hold", className: "col-span-1" },
                { icon: "A15", title: "A15 Bionic", className: "col-span-1" },
            ]
        },
    ];

    const nextPage = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage((prev) => (prev + 1) % pages.length);
                setIsTransitioning(false);
            }, 500);
        }
    };

    const prevPage = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
                setIsTransitioning(false);
            }, 500);
        }
    };

    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        if (isLeftSwipe) {
            nextPage();
        } else if (isRightSwipe) {
            prevPage();
        }
    };

    return (
        <div 
            className="carousel-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <style>{customStyles}</style>
            <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <CarouselPage {...pages[currentPage]} />
            </div>
            <button 
                onClick={prevPage} 
                className="nav-button nav-button-left" 
                disabled={isTransitioning}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button 
                onClick={nextPage} 
                className="nav-button nav-button-right" 
                disabled={isTransitioning}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
            <div className="flex justify-center mt-4">
                {pages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => !isTransitioning && setCurrentPage(index)}
                        className={`h-3 w-3 rounded-full mx-1 ${index === currentPage ? 'bg-white' : 'bg-gray-400'}`}
                        disabled={isTransitioning}
                    />
                ))}
            </div>
        </div>
    );
};

ReactDOM.render(<FeatureCarousel />, document.getElementById('feature-carousel-container'));