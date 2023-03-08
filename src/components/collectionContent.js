import "../css/collectionContent.css";
import { useEffect, useState } from "react";
import { createApi } from "unsplash-js";


const api = createApi({
    // Don't forget to set your access token here!
    // See https://unsplash.com/developers
    accessKey: "qC1c2n8GBb0rVl4ZtKjnlGyqYrOrY1uY11nTfxep2mo"
});


export default function CollectionContent(props) {
    const [collectionData, setCollectionData] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [translateX, setTranslateX] = useState(0);
    const [activeImage, setActiveImage] = useState('');
    const [activeColor, setActiveColor] = useState('');
    const [activeDescription, setActiveDescription] = useState('');


    /**
     * API Call for collection data
     */
    useEffect(() => {
        // Reset collectionData before new fetch
        setCollectionData([]);
        // Set fetched state to false, then updated to true when fetched
        setImagesLoaded(false);

        api.collections.getPhotos({ collectionId: `${props.collectionId}`, perPage: 36 })
        .then((data) => {
            setCollectionData(data.response.results)
            setImagesLoaded(true);
            setTranslateX(0);
            setActiveImage('');
        })
        .catch((error) => console.log(error));
    }, [props]);


    /**
     * Handle keyboard navigation when slides are active
     */
    useEffect (() => {
        const carousel = document.getElementById('carousel-inner-container');
        const slides = Array.from(carousel.querySelectorAll('.slide'));
        let activeSlideIndex = 0;
        const currentItem = slides[activeSlideIndex];

        if(imagesLoaded) {
            setActiveSlide(0);
        }


    
        // function to update the active slide
        function setActiveSlide(index) {
            slides.forEach((slide) => {
                slide.classList.remove('active');
            });
            slides[index].classList.add('active');
            activeSlideIndex = index;
            setActiveImage(`${slides[index].getAttribute('data-url')}`);
            setActiveColor(`${slides[index].getAttribute('data-color')}`);
            setActiveDescription(`${slides[index].getAttribute('data-altDescription')}`);
        }
    
        // manual click navigation left
        const navLeft = document.getElementById('nav-left');
        navLeft.addEventListener('click', () => {
            if(activeSlideIndex >= 1) {
                setActiveSlide((activeSlideIndex - 1 + slides.length) % slides.length);
                setTranslateX(-25 * activeSlideIndex); // 25 represents percentage
                currentItem.focus();
                currentItem.click();
            }
        })

        // manual click navigation right
        const navRight = document.getElementById('nav-right');
        navRight.addEventListener('click', () => {
            if(activeSlideIndex !== slides.length - 1) {
                setActiveSlide((activeSlideIndex + 1) % slides.length);
                setTranslateX(-25 * activeSlideIndex); // 25 represents percentage
                currentItem.focus();
                currentItem.click();
            }
        })

        // event listener for remote control input
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    if(activeSlideIndex >= 1) {
                        setActiveSlide((activeSlideIndex - 1 + slides.length) % slides.length);
                        setTranslateX(-25 * activeSlideIndex); // 25 represents percentage
                        currentItem.focus();
                        currentItem.click();
                    }
                break;
                case 'ArrowRight':
                    if(activeSlideIndex !== slides.length - 1) {
                        setActiveSlide((activeSlideIndex + 1) % slides.length);
                        setTranslateX(-25 * activeSlideIndex); // 25 represents percentage
                        currentItem.focus();
                        currentItem.click();
                    }
                break;
            }
        });    
    },[imagesLoaded, collectionData]);


    return (
        <div id="carousel-container" style={{backgroundImage: `radial-gradient(circle,${activeColor} 1%, black 80%)`}}>
            <div className="image-in-view-container">
                <div
                    className="image-in-view" 
                    style={{backgroundImage: `url('${activeImage}')`}} 
                >
                    {
                        activeDescription === 'null' || activeDescription === 'text' ? (
                            <p>No description available</p>
                        ) : (
                            <p>{activeDescription}</p>
                        )
                    }
                </div>
            </div>

            <div id="carousel-inner-container">
                <div id="carousel" style={{transform: `translatex(${translateX}%)`}}>
                    {
                        Object.keys(collectionData).length < 1 ? (
                            <p>Loading...</p>
                        ) : (
                            collectionData.map((item, index) => {
                                console.log(item);
                                return(
                                    <li 
                                        className="slide" 
                                        style={{backgroundImage: `url(${item.urls.thumb})`}}
                                        key={item.id}
                                        tabIndex={index}
                                        data-url={item.urls.regular}
                                        data-color={item.color}
                                        data-altDescription={item.alt_description}
                                    >
                                    </li>
                                )
                            })
                        )
                    }
                </div>
                <button 
                    id="nav-left"
                    className="nav-left"
                >
                    <i class="nav-arrow fa-solid fa-arrow-left"></i>
                </button>
                <button 
                    id="nav-right"
                    className="nav-right"
                >
                    <i class="nav-arrow fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    )
}