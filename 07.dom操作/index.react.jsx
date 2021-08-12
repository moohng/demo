import { fetchData } from './api';

let app;

document.getElementById('reactInit').addEventListener('click', function () {

  class App extends React.Component {
    state = {
      list: [],
    };

    componentDidMount() {
      this.refresh();
    }

    refresh() {
      fetchData().then(data => {
        this.setState({ list: data });
      });
    }

    render() {
      return (
        <>
          {this.state.list.map((item, index) => {
            return (
              <div className="cell-bar" key={index}>
                <div className="avatar" style={{backgroundImage: 'url(' + item.avatar + ')'}}></div>
                <div className="content">
                  <div className="title">{ item.name }</div>
                  <div className="subtitle">{ item.bird }</div>
                </div>
              </div>
            );
          })}
        </>
      );
    }
  }

  app = ReactDOM.render(<App />, document.getElementById('app'));
}, false);

document.getElementById('reactUpdate').addEventListener('click', function () {
  app.refresh();
}, false);
