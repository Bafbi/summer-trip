import { FaStar, FaRegStar } from "react-icons/fa";

const RatingStars = ({ rating }) => {
  let stars = [];
  for(let i = 1; i <= 5; i++) {
    stars.push(i <= rating ? <FaStar key={i} /> : <FaRegStar key={i} />);
  }
  return (
    <div className="flex justify-center mt-2">
      {stars}
    </div>
  );
};

export default RatingStars;
