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

    useEffect(() => {
        api.collections.getPhotos({ collectionId: `${props.collectionId}`, perPage: 36 })
        .then((data) => setCollectionData(data.response.results))
        .catch((error) => console.log(error));
        console.log(props.collectionId);
        console.log(collectionData);
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
    },[]);

    return (
        <div id="carousel-container">
            <div id="carousel">
                {
                    collectionData.map((item, index) => {
                        return(
                            <li 
                                className="slide" 
                                id={item.id}
                                tabIndex={index}
                                style={{backgroundImage: `url(${item.urls.thumb})`}}
                            >
                            </li>
                        )
                    }) 
                }
            </div>
        </div>
    )
}