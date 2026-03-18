import React, { useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowUpRight, Rocket } from 'lucide-react';

const tabs = ['Newest', 'Trending', 'Following'];

export default function Launchpad() {
  const navigate = useNavigate();
  const { products = [], upvoteProduct } = useOutletContext();
  const [activeTab, setActiveTab] = useState('Newest');

  const visibleProducts = useMemo(() => {
    if (activeTab === 'Newest') {
      return products;
    }

    return products.filter((product) => product.category === activeTab);
  }, [activeTab, products]);

  return (
    <section
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--accent-color)',
            color: '#fff',
          }}
        >
          <Rocket size={22} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Launchpad</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)' }}>
            Discover standout launches from the maker community.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 16px',
              borderRadius: '999px',
              border: activeTab === tab ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
              background: activeTab === tab ? 'rgba(249, 115, 22, 0.1)' : 'var(--card-bg)',
              color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {visibleProducts.map((product, index) => (
          <article
            key={product.id}
            onClick={() => navigate(`/launchpad/${product.id}`)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
              padding: '20px',
              borderRadius: '18px',
              background: index === 0 ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(249, 115, 22, 0.04))' : 'rgba(0, 0, 0, 0.02)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>{product.name}</h2>
                <ArrowUpRight size={16} color="var(--text-secondary)" />
              </div>
              <p style={{ margin: '0 0 14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {product.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '999px',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                upvoteProduct(product.id);
              }}
              style={{
                minWidth: '84px',
                alignSelf: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 12px',
                borderRadius: '16px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
              }}
            >
              <Rocket size={18} color="var(--accent-color)" />
              <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>{product.upvotes}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
                UPVOTE
              </div>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
