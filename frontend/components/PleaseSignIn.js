import { Query } from 'react-apollo';
import { useUser } from './User';
import Signin from './Signin';

function PleaseSignIn(props) {
  const me = useUser();
  // TODO loading???
  const loading = false;
  if (loading) return <p>Loading...</p>;
  if (!me) {
    return (
      <div>
        <p>Please Sign In before Continuing</p>
        <Signin />
      </div>
    );
  }
}

export default PleaseSignIn;
