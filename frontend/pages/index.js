import PropTypes from 'prop-types';
import Items from '../components/Items';

const Home = ({ query }) => (
  <div>
    <Items page={parseFloat(query.page) || 1} />
  </div>
);

Home.propTypes = {
  query: PropTypes.shape({
    page: PropTypes.number,
  }),
};

export default Home;
