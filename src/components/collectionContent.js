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
    let selectedTab = props.selectedTab;

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

    useEffect(() => {
        // Reset collectionData before new fetch
        setCollectionData([]);
        setImagesLoaded(false);

        api.collections.getPhotos({ collectionId: `${props.collectionId}`, perPage: 36 })
        .then((data) => {
            setCollectionData(data.response.results)
            setImagesLoaded(true);
        })
        .catch((error) => console.log(error));
    }, [props]);

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
    },[imagesLoaded]);

    return (
        <div id="carousel-container">
            <div id="carousel">
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