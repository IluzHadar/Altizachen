import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import data from '../data';

function HomeScreen() {
  //setAds is a function to update the variable 'ads'
  const [ads, setAds] = useState([]);
  useEffect(() => {
    //call API and get data from backend
    const fetchData = async () => {
      const result = await axios.get('/api/ads');
      setAds(result.data); //result.data is all the adds in the backend
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Featured ads</h1>
      <div className="ads">
        {ads.map((ad) => (
          <div className="ad" key={ad.slug}>
            <Link to={`/ad/${ad.slug}`}>
              <img src={ad.image} alt={ad.name} />
            </Link>
            <div className="ad-info">
              <Link to={`/ad/${ad.slug}`}>
                <p>{ad.name}</p>
              </Link>
              <p>
                <strong>category: {ad.category}</strong>
              </p>
              <p>
                <strong>description: {ad.description}</strong>
              </p>
              <p>
                <strong>number of reviews: {ad.numReviews}</strong>
              </p>
              <button>review ad</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default HomeScreen;
