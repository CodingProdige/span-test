import React, { useState, useEffect } from 'react';
import { createApi } from "unsplash-js";
import '../css/collections.css';
import CollectionContent from './collectionContent';

const api = createApi({
  // Don't forget to set your access token here!
  // See https://unsplash.com/developers
  accessKey: "qC1c2n8GBb0rVl4ZtKjnlGyqYrOrY1uY11nTfxep2mo"
});

function UnsplashCollection() {
  const [collectionItems, setCollectionItems] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [collectionId, setCollectionId] = useState(null);

  const handleClick = (index, id) => {
    setSelectedTab(index);
    setCollectionId(id);
  };

  useEffect(() => {
    api.collections.list({ page: 2, perPage: 10 })
    .then((data) => {
        setCollectionItems(data.response.results)
        setCollectionId(data.response.results[0].id)
        console.log(data.response.results[0].id)
    })
    .catch((error) => console.log(error));
  }, []);

  return (
    <div className='main-container'>
        <div className='collections-list-container'>
            <ul>
                {
                    collectionItems && collectionItems.map((item, index) => (
                        <li 
                            className={selectedTab === index ? 'active collections-list-item' : 'collections-list-item'}
                            key={item.id} 
                            tabIndex={index}
                            onClick={() => handleClick(index, item.id)}
                        >
                            <p className='collections-list-item-title'>{item.title}</p>
                            <div className='collections-list-item-background' style={{backgroundImage: `url(${item.cover_photo.urls.thumb})`}}>
                                <div className='opacity-layer'></div>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
        
        <div className='collections-carousel-container'>
            <CollectionContent collectionId={collectionId}/>
        </div>

    </div>
  );
}

export default UnsplashCollection;