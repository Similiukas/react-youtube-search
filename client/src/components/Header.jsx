import Input from './Input'

const Header = ({ refToDiv, onSearch }) => {
    return (
        <div className="header" ref={refToDiv}>
            <h1>Search for YouTube videos by a word or a phrase</h1>
            <Input onSearch={onSearch}/>
        </div>
    )
}

export default Header
 