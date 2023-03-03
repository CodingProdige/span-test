import { useEffect } from "react";


export default function MainCarousel () {


    useEffect (() => {
        const carousel = document.getElementById('carousel');
        const slides = Array.from(carousel.querySelectorAll('.slide'));
        let activeSlideIndex = 0;
    
        // function to update the active slide
        function setActiveSlide(index) {
            slides.forEach((slide) => {
                slide.classList.remove('active');
            });
            slides[index].classList.add('active');
            activeSlideIndex = index;
        }
    
        // event listener for remote control input
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                setActiveSlide((activeSlideIndex - 1 + slides.length) % slides.length);
                break;
                case 'ArrowRight':
                setActiveSlide((activeSlideIndex + 1) % slides.length);
                break;
            }
        });    
    },[]);

    return (
        <div id="carousel">
            <div id="slide1" className="slide">
                <p>Slide 1</p>
            </div>
            <div id="slide2" className="slide">
                <p>Slide 2</p>
            </div>
            <div id="slide3" className="slide">
                <p>Slide 3</p>
            </div>

        </div>
    )
}