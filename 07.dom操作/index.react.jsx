import { fetchData } from './api';

let refresh;

document.getElementById('reactInit').addEventListener('click', function () {
  const App = () => {
    const [list, setList] = React.useState([]);

    refresh = () => fetchData().then(data => setList(data));

    React.useEffect(refresh, []);

    return list.map((item, index) => (
      <div className="cell-bar" key={index}>
        <div className="avatar" style={{backgroundImage: 'url(' + item.avatar + ')'}}></div>
        <div className="content">
          <div className="title">{ item.name }</div>
          <div className="subtitle">{ item.bird }</div>
        </div>
      </div>
    ));
  };

  ReactDOM.render(<App />, document.getElementById('app'));
}, false);

document.getElementById('reactUpdate').addEventListener('click', () => refresh && refresh(), false);
