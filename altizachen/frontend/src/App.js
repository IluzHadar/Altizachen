import data from './data';

function App() {
  return (
    <div>
      <header>
        <a href="/">Altizachen</a>
      </header>
      <main>
        <h1>Featured adds</h1>
        <div className="adds">
          {data.adds.map((add) => (
            <div className="add" key={add.slug}>
              <a href={`/add/${add.slug}`}>
                <img src={add.image} alt={add.name} />
              </a>
              <div className="add-info">
                <a href={`/add/${add.slug}`}>
                  <p>{add.name}</p>
                </a>
                <p>
                  <strong>${add.category}</strong>
                </p>
                <button>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
