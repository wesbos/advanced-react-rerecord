import { useUser } from './User';
import Signin from './Signin';

function PleaseSignIn({ children }) {
  const me = useUser();
  // TODO Loading..
  if (!me) return <Signin />;
  return children;
}

export default PleaseSignIn;
