import axios from 'axios';
import { useEffect, useState } from 'react';

/**
 * Fetch custom hook to manage external requests. This hook require `axios` library
 * so first of all run `npm i axios@latest` or `yarn add axios`.
 * @param {string} url
 * @param {object} options
 * @returns `{ data: Any, loading: Boolean, error: Boolean|String, reload: Function }`
 */
export default function useFetch(url, options = { method: 'GET', headers: {}, data: null }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = async () => {
    try {
      // Reset errors and loading state everytime reload() is called
      setError(false);
      setLoading(true);
      // Await response from axios passing url and options parameters
      const response = await axios({
        url,
        method: options.method,
        headers: options.headers,
        data: options.data,
      });
      // Destructuring and rename of data from response object
      const { data: _data } = response;
      // Set new data with data from resposne and loading state to false
      setData(_data);
      setLoading(false);
    } catch (err) {
      // If any error occured set error state with error message and loading state to false
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    // Immediately call reload()
    reload();
  }, []);

  // Return all managed by an internal state
  // that makes it reactive
  return {
    data,
    loading,
    error,
    reload,
  }
}

/**
 ** USAGE
 *
 * export default MyComponent() {
 *    const { data, loading, error, reload } = useFetch('https://my-api.com/v1/my-endpoint');
 *
 *    if (loading) return <p>Loading...</p>
 *
 *    if (error) return <p>Error: {error}</p>
 *
 *    return (
 *      <>
 *        {
 *          data.map(item => {
 *            return <div key={item.id}>{item.myparam}<div>
 *          })
 *        }
 *      </>
 *    )
 *
 * }
 *
 ** Another use case
 *
 * export default MyComponent() {
 *    const [data, setData] = useState([]);
 *    const { data: data1, loading: loading1, error: error1, reload: reload1 } = useFetch('https://my-api.com/v1/my-1-endpoint');
 *    const { data: data2, loading: loading2, error: error2, reload: reload2 } = useFetch('https://my-api.com/v1/my-2-endpoint');
 *
 *    useEffect(() => {
 *      if (data1.lengh > 0 && data2.lengh > 0) {
 *        const _data = data1.map(item => {
 *          const price = data2.find(d => d.symbol == item.symbol);
 *          return {
 *            ...item,
 *            price,
 *          }
 *        });
 *        setData(_data);
 *      }
 *    }, [data1, data2])
 *
 *    if (loading) return <p>Loading...</p>
 *
 *    if (error) return <p>Error: {error}</p>
 *
 *    return (
 *      <>
 *        {
 *          _data.length > 0 && _data.map(item => {
 *            return <div key={item.id}>{item.myparam}<div>
 *          })
 *        }
 *      </>
 *    )
 *
 * }
 *
 ** Using with params and quesry params
 *
 * export default MyComponent() {
 *    const { id } = useParams();
 *    const [searchParams] = useSearchParams();
 *    const { data, loading, error, reload } = useFetch(`https://my-api.com/v1/my-endpoint/${id}?uid=${searchParams.get('uid)}`); // From url like `/my-component/myuniqueid123?uid=myuniqueuid123`
 *
 *    if (loading) return <p>Loading...</p>
 *
 *    if (error) return <p>Error: {error}</p>
 *
 *    return (
 *      <>
 *        {
 *          data.map(item => {
 *            return <div key={item.id}>{item.myparam}<div>
 *          })
 *        }
 *      </>
 *    )
 *
 * }
 *
 */
