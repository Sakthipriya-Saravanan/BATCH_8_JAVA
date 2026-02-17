import { useEffect } from 'react'

export default function CustomModal({ show, onClose, title, children, footer }) {
    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        if (show) {
            document.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [show, onClose])

    if (!show) return null

    return (
        <div className="custom-modal-overlay" onClick={onClose}>
            <div className="custom-modal" onClick={e => e.stopPropagation()}>
                <div className="custom-modal-header">
                    <h5 className="custom-modal-title">{title}</h5>
                    <button className="custom-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="custom-modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="custom-modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}
