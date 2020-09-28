import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import Items from '../components/Items';
// import { PAGINATION_QUERY } from '../components/Pagination';

function Home({ query }) {
  // const { data, loading } = useQuery(PAGINATION_QUERY);
  // if (loading) return 'Loading...';
  return (
    <div>
      <Items
        page={parseFloat(query.page) || 1}
        // count={100 || data._allItemsMeta.count}
        count={100}
      />
    </div>
  );
}

Home.propTypes = {
  query: PropTypes.shape({
    page: PropTypes.string,
    count: PropTypes.number,
  }),
};

export default Home;
