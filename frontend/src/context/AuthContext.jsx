import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => {
        const stored = localStorage.getItem('campus_auth')
        return stored ? JSON.parse(stored) : null
    })

    useEffect(() => {
        if (auth) {
            localStorage.setItem('campus_auth', JSON.stringify(auth))
        } else {
            localStorage.removeItem('campus_auth')
        }
    }, [auth])

    const login = (userData) => {
        // userData: { userId, name, email, role }
        setAuth(userData)
    }

    const logout = () => {
        setAuth(null)
    }

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
