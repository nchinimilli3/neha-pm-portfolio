import { useState } from 'react';
import './estee-demo.css';

const photo = (name: string) => `${import.meta.env.BASE_URL}project-media/${name}`;

const bottles = [
  'estee-bottle-04.png', 'estee-bottle-03.png', 'estee-bottle-07.png', 'estee-bottle-02.png',
  'estee-bottle-06.png', 'estee-bottle-05.png', 'estee-bottle-01.png', 'estee-bottle-04.png',
];

const retailers = [
  { name: 'ESTÉE LAUDER', url: 'https://www.esteelauder.com/products/643/product-catalog/makeup/face/foundation' },
  { name: 'SEPHORA', url: 'https://www.sephora.com/search?keyword=estee%20lauder%20double%20wear' },
  { name: 'ULTA', url: 'https://www.ulta.com/search?search=estee%20lauder%20double%20wear' },
  { name: 'NORDSTROM', url: 'https://www.nordstrom.com/sr?keyword=estee%20lauder%20double%20wear' },
];

export default function EsteeDemo() {
  const [page, setPage] = useState<'home' | 'shop'>('home');
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (next: 'home' | 'shop') => {
    setPage(next);
    setMenuOpen(false);
  };

  return <div className="elDemo" data-no-lightbox aria-label="Estée Lauder Double Wear demo">
    {page === 'home' ? <div className="elDemoPage elDemoHome">
      <header className="elDemoHeader elDemoHomeHeader">
        <button className="elDemoWordmark" type="button" onClick={() => go('home')} aria-label="Estée Lauder home"><img src={photo('estee-wordmark-white.png')} width="540" height="67" alt="" /></button>
        <nav aria-label="Demo navigation">
          <button type="button" aria-current="page" onClick={() => go('home')}>Home</button>
          <button type="button" onClick={() => go('shop')}>Shop</button>
        </nav>
      </header>
      {welcomeVisible && <div className="elDemoWelcome">
        <button className="elDemoWelcomeLink" type="button" onClick={() => go('shop')}>Welcome! Explore Double Wear <span aria-hidden="true">→</span></button>
        <button type="button" aria-label="Dismiss welcome message" onClick={() => setWelcomeVisible(false)}>×</button>
      </div>}
      <img className="elDemoFlatlay" src={photo('estee-flatlay-supplied.png')} width="800" height="400" alt="Estée Lauder Double Wear foundation bottles arranged diagonally" />
    </div> : <div className="elDemoPage elDemoShop">
      <header className="elDemoHeader elDemoShopHeader">
        <button className="elDemoWordmark" type="button" onClick={() => go('home')} aria-label="Estée Lauder home"><img src={photo('estee-wordmark-white.png')} width="540" height="67" alt="" /></button>
        <button className="elDemoMenuButton" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>Menu <span className="elDemoMenuLines" aria-hidden="true"><i/><i/><i/></span></button>
        {menuOpen && <nav className="elDemoMenu" aria-label="Demo pages"><button type="button" onClick={() => go('home')}>Home</button><button type="button" aria-current="page" onClick={() => go('shop')}>Shop</button></nav>}
      </header>
      <section className="elDemoShopIntro" aria-label="Double Wear makeup">
        <img src={photo('estee-models-supplied.png')} width="540" height="540" alt="Three models wearing Double Wear makeup with foundation bottles" />
        <div className="elDemoShopCopy"><div className="elDemoHeadline" role="heading" aria-level={3}>Beautiful your way.</div><strong>DOUBLE WEAR MAKEUP</strong><p>24-hour wear. No touch ups needed. With Double Wear, what makes you different is beautiful. The shade more than matches, it flatters you.</p></div>
      </section>
      <section className="elDemoProducts" aria-label="Double Wear foundation and retailer links">
        {bottles.map((name, index) => <div className="elDemoProduct" key={`${name}-${index}`}>
          <img src={photo(name)} width="526" height="994" alt={`Double Wear foundation bottle ${index + 1}`} loading={index < 4 ? 'eager' : 'lazy'} />
          {index < 4 && <a href={retailers[index].url} target="_blank" rel="noopener noreferrer" aria-label={`Shop Double Wear at ${retailers[index].name} (opens in a new tab)`}>{retailers[index].name}</a>}
        </div>)}
      </section>
    </div>}
  </div>;
}
