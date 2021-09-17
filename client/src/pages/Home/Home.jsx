import { useEffect, useState } from "react";
import classes from "./Home.module.scss";
import { useDispatch } from "react-redux";
import { accessCategoriesDataList } from "../../Redux/categoriesListReducer";

import { Link } from "react-router-dom";
import OfferBanner from "../../components/OfferBanner/OfferBanner";
import Axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
export default function Home() {
  const dispatch = useDispatch();
  const [bannerData, setBannerData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [newCategoriesData, setNewCategoriesData] = useState([]);
  //api call for banners data
  useEffect(() => {
    document.title = "S B | Home";
    Axios.get("http://localhost:5005/banners")
      .then((res) => {
        setBannerData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //api call for categories:- Home
  useEffect(() => {
    Axios.get("http://localhost:5005/categories")
      .then((res) => {
        setCategoriesData(res.data);
        dispatch(accessCategoriesDataList(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (categoriesData) {
      const items = [...categoriesData];
      let sortedData = items.sort((a, b) => a?.order - b?.order);
      setNewCategoriesData(sortedData);
    }
  }, [categoriesData]);

  return (
    <div className={classes.Container}>
      <div className={classes.CarouselContainer}>
        <Carousel
          autoPlay="true"
          infiniteLoop="true"
          useKeyboardArrows="true"
          interval="2000"
        >
          {bannerData.map((item) => (
            <OfferBanner
              key={item?.id}
              bannerImageUrl={item?.bannerImageUrl}
              bannerImageAlt={item?.bannerImageAlt}
            />
          ))}
        </Carousel>
      </div>

      {newCategoriesData.map((item) =>
        item?.order !== -1 ? (
          <CategoryCard
            key={item?.id}
            id={item?.id}
            imageUrl={item.imageUrl}
            name={item.name}
            description={item?.description}
            alt={item?.key}
            order={item.order}
          />
        ) : null
      )}
    </div>
  );
}
