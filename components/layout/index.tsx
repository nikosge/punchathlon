import Header from "../header"


const Layout = ({children}) => {
    return (
        <div>
            <Header/>
            <main style={{backgroundColor: "#f7f7f7"}}>
                {children}
            </main>
        </div>
    )
}

export default Layout