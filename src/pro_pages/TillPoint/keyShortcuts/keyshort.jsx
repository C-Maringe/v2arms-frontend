export default class Example extends Component {
    constructor(props) {
        super(props)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.state = {
            cursor: 0,
            result: []
        }
    }

    handleKeyDown(e) {
        const { cursor, result } = this.state
        // arrow up/down button should select next/previous list element
        if (e.keyCode === 38 && cursor > 0) {
            this.setState(prevState => ({
                cursor: prevState.cursor - 1
            }))
        } else if (e.keyCode === 40 && cursor < result.length - 1) {
            this.setState(prevState => ({
                cursor: prevState.cursor + 1
            }))
        }
    }

    render() {
        const { cursor } = this.state

        return (
            <Container>
                <Input onKeyDown={this.handleKeyDown} />
                <List>
                    {
                        result.map((item, i) => (
                            <List.Item
                                key={item._id}
                                className={cursor === i ? 'active' : null}
                            >
                                <span>{item.title}</span>
                            </List.Item>
                        ))
                    }
                </List>
            </Container>
        )
    }
}