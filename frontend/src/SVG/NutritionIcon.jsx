const NutritionIcon = ({ type }) => {
  switch(type) {
    case 'calories':
      return (
        <svg className="nutrition-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case 'protein':
      return (
        <svg className="nutrition-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M2 12h20" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case 'carbohydrates':
      return (
        <svg className="nutrition-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12" />
          <path d="M6 12h12" />
        </svg>
      );
    case 'fat':
      return (
        <svg className="nutrition-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="m3 9 9-6 9 6" />
          <path d="M3 15h18" />
        </svg>
      );
    default:
      return null;
  }
};

export default NutritionIcon;