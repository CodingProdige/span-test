import React, { useState, useEffect } from 'react';
import { createApi } from "unsplash-js";
import '../css/collections.css';
import CollectionContent from './collectionContent';


/**
 * Unsplash API Connection
 */
const api = createApi({
  // See https://unsplash.com/developers
  accessKey: "qC1c2n8GBb0rVl4ZtKjnlGyqYrOrY1uY11nTfxep2mo"
});



function UnsplashCollection() {
  const [collectionItems, setCollectionItems] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [collectionId, setCollectionId] = useState(null);
  const [contentLoaded, setContentLoaded] = useState(false);


  /**
   * Mouse click Manual + Emulated
   * @param {* collection item index } index 
   * @param {* collection item unsplash id } id 
   */
  const handleClick = (index, id) => {
    setSelectedTab(index);
    setCollectionId(id);    
    console.log(id); 
  };



  /**
   * API Collection Call
   * Page: 2
   * Limit: 10
   */
  useEffect(() => {
    api.collections.list({ page: 2, perPage: 10 })
    .then((data) => {
      setCollectionItems(data.response.results);
      setCollectionId(data.response.results[0].id);
      setContentLoaded(true);
    })
    .catch((error) => console.log(error));
  }, []);


  /**
   * Handle Remote Input
   * Up + Down + Enter
   */
  useEffect (() => {
    // Collections array
    const list = document.getElementById('collectionList');
    const items = Array.from(list.querySelectorAll('.collections-list-item'));
    let activeItemIndex = 0;

    // function to update the active slide
    function setActiveItem(index) {
      console.log(index);
      items.forEach((item) => {
          item.classList.remove('active');
      });
      items[index].classList.add('active');
      activeItemIndex = index;

      // simulate click when item is selected
      const currentItem = items[index];
      currentItem.focus();
      currentItem.click();
    }
   



    // event listener for remote control input
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
              setActiveItem((activeItemIndex - 1 + items.length) % items.length);
            break;
            case 'ArrowDown':
              setActiveItem((activeItemIndex + 1) % items.length);
            break;
        }
    });    
  },[contentLoaded]);


  return (
    <div className='main-container'>
        <div className='collections-list-container'>
            <ul id='collectionList'>
              {
                collectionItems && collectionItems.map((item, index) => (
                  <li 
                    id={`collection_${index}`}
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
          {
            collectionId && (
              <CollectionContent 
                collectionId={collectionId}
                selectedTab={selectedTab}
              />
            )
          }
        </div>

    </div>
  );
}

export default UnsplashCollection;