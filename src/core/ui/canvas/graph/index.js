import React from "react";
import "./graph.scss";
import D3ForceDirectedCanvas from "./canvas";
import LegendCanvas from "./legend";
import SelectedDataCanvas from "./selected-data";
import GremlinResponseSerializers from "../../../gremlin-connector/gremlin-serializer";

const serializer = new GremlinResponseSerializers()

export default class GraphCanvas extends React.Component {

    static defaultProps = {
        responses: [],
        shallReRenderD3Canvas: null,
        queryGremlinServer: () => console.error("queryGremlinServer prop not set for GraphCanvas"),
        setShowVertexOptions: (selectedNode) => console.error("setShowVertexOptions prop not set for GraphCanvas")
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedData: null
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.shallReRenderD3Canvas === true) {
            this.props.resetShallReRenderD3Canvas()
        }
        this.render();
    }

    getSelectedElementDataFn(selectedData) {
        // this.shallReRenderD3Canvas = false;
        this.setState({
            selectedData: selectedData
        })
    }

    onFlyOutSelectedDataClose() {
        this.getSelectedElementDataFn(null);
    }

    render() {


        let overallNodes = [];
        let overallLinks = [];
        this.props.responses.forEach(function (response) {
            const serializedData = serializer.process(response);
            const separatedData = serializer.separateVerticesAndEdges(serializedData);
            overallNodes = overallNodes.concat(separatedData['nodes']);
            overallLinks = overallLinks.concat(separatedData['links']);
        });
        const uniqueNodes = [...new Map(overallNodes.map(item => [item.id, item])).values()];
        const uniqueLinks = [...new Map(overallLinks.map(item => [item.id, item])).values()];

        return (
            <div className={"graphCanvas"}>
                <D3ForceDirectedCanvas
                    nodes={uniqueNodes}
                    links={uniqueLinks}
                    shallReRenderD3Canvas={this.props.shallReRenderD3Canvas}
                    getSelectedElementDataFn={this.getSelectedElementDataFn.bind(this)}
                    queryGremlinServer={this.props.queryGremlinServer}
                    setShowVertexOptions={this.props.setShowVertexOptions}
                />
                <SelectedDataCanvas selectedData={this.state.selectedData}
                                    onClose={this.onFlyOutSelectedDataClose.bind(this)}
                />
                <LegendCanvas
                    nodes={uniqueNodes}
                    links={uniqueLinks}
                    // nodeLabels={this.props.nodeLabels}
                    // linkLabels={this.props.linkLabels}
                />
            </div>


        )
    }
}
