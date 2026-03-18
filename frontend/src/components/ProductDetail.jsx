import React from 'react';
import { Navigate, useOutletContext, useParams } from 'react-router-dom';
import { ArrowUpRight, Rocket } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { products = [], upvoteProduct } = useOutletContext();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return <Navigate to="/launchpad" replace />;
  }

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
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <h1 style={{ margin: 0, fontSize: '32px' }}>{product.name}</h1>
            <ArrowUpRight size={18} color="var(--text-secondary)" />
          </div>
          <p style={{ margin: '0 0 12px', color: 'var(--text-primary)', fontSize: '16px', lineHeight: 1.6 }}>
            {product.fullDescription}
          </p>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {product.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => upvoteProduct(product.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minWidth: '108px',
            padding: '18px 16px',
            borderRadius: '18px',
            border: '1px solid var(--border-color)',
            background: 'var(--card-bg)',
            cursor: 'pointer',
          }}
        >
          <Rocket size={20} color="var(--accent-color)" />
          <div style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1 }}>{product.upvotes}</div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
            UPVOTE
          </div>
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
        {product.tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: '8px 12px',
              borderRadius: '999px',
              background: 'rgba(0, 0, 0, 0.03)',
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
    </section>
  );
}
