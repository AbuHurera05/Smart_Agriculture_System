export default function TestTailwind() {
  return (
    <div className="p-8">
      <div className="card card-hover">
        <h1 className="text-3xl font-bold text-gradient mb-4">
          Tailwind CSS 4.x is Working! 🎉
        </h1>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
          </div>
          <div className="flex gap-2">
            <span className="badge badge-success">Success</span>
            <span className="badge badge-warning">Warning</span>
            <span className="badge badge-danger">Danger</span>
            <span className="badge badge-info">Info</span>
          </div>
          <input 
            type="text" 
            placeholder="Test input field..." 
            className="input-field"
          />
        </div>
      </div>
    </div>
  )
}