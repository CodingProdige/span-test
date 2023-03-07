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
    const [selectedTab, setSelectedTab] = useState(0)
    const [activeImage, setActiveImage] = useState('');


    /**
     * Handle keyboard navigation going from collections to slides
     */
    document.addEventListener('keydown', (event) => {
        const focusedElement = document.activeElement;
        const carousel = document.getElementById('carousel');
        const images = Array.from(carousel.querySelectorAll('.slide'));
      
    
        switch (event.key) {
          case 'RightArrow': 
            if( focusedElement.classList.contains('collections-list-item') ) {
              // simulate click when item is selected
              const currentItem = images[0];
              currentItem.focus();
              currentItem.click();
            }
          break;
          case 'LeftArrow': 
            if( focusedElement.classList.contains('slide') && focusedElement.getAttribute(selectedTab) === 0 ) {
              // simulate click when item is selected
              const collection = document.getElementById(`collection_${selectedTab}`);
              const currentItem = collection;
              currentItem.focus();
              currentItem.click();
            }
          break;
        }
    })

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
            setSelectedTab(props.selectedTab);
            setTranslateX(0);
        })
        .catch((error) => console.log(error));
    }, [props]);


    /**
     * Handle keyboard navigation when slides are active
     */
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
            setActiveImage(`${slides[index].getAttribute('data-url')}`);
        }
    
        // event listener for remote control input
        document.addEventListener('keydown', (event) => {
            const currentItem = slides[activeSlideIndex];
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
                    if(activeSlideIndex != slides.length - 1) {
                        setActiveSlide((activeSlideIndex + 1) % slides.length);
                        setTranslateX(-25 * activeSlideIndex); // 25 represents percentage
                        currentItem.focus();
                        currentItem.click();
                    }
                break;
            }
        });    
    },[imagesLoaded]);

    return (
        <div id="carousel-container">
            <div className="image-in-view-container">
                <div
                    className="image-in-view" 
                    style={{backgroundImage: `url('${activeImage}')`}} 
                ></div>
            </div>

            <div id="carousel" style={{transform: `translatex(${translateX}%)`}}>
                {
                    Object.keys(collectionData).length < 1 ? (
                        <p>Loading...</p>
                    ) : (
                        collectionData.map((item, index) => {
                            return(
                                <li 
                                    className="slide" 
                                    style={{backgroundImage: `url(${item.urls.thumb})`}}
                                    key={item.id}
                                    tabIndex={index}
                                    data-url={item.urls.thumb}
                                >
                                </li>
                            )
                        })
                    )
                }
            </div>
        </div>
    )
}