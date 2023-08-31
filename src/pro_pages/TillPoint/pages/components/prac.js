const Listdata = ({ data, active, setSelected, setHovered }) => (
    <div
        className={`data ${active ? "active" : ""}`}
        onClick={() => setSelected(data)}
        onMouseEnter={() => setHovered(data)}
        onMouseLeave={() => setHovered(undefined)}
    >
        {data.name}
    </div>
); 