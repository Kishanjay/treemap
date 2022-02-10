export default function Maple() {
    return (
        <Row>
            <Box>Hello</Box>
        </Row>
    )
}


const Row = ({children}) => {
    return <div style={{display: 'flex'}}>{children}</div>
}

const Box = ({children}) => {
    return (<div style={{borderWidth: '1px', padding: '8px', margin: '8px'}}>{children}</div>)
}