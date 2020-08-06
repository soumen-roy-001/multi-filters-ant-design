import React, { useState, useEffect } from 'react';
import {
    Button,
    Row,
    Col,
    Select,
    Input,
    Typography,
    Divider,
    Table,
    Spin
} from "antd";

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

const categories = [
    {
        value: "properties",
        title: "Properties"
    }, {
        value: "formulation_components",
        title: "Formulation Components"
    }
]

const subcategories = {
    properties: ["hardness_ShoreA"],
    formulation_components: ["taic_100_pct_liquid"]
}

const operators = [
    {
        name: "=",
        value: "eq"
    },
    {
        name: ">",
        value: "gt"
    },
    {
        name: ">=",
        value: "gte"
    },
    {
        name: "<",
        value: "lt"
    },
    {
        name: "<=",
        value: "lte"
    },
];

const FormulaDetails = ({ details }) => {
    return (
        <div className="Formula-details" >
            <Title level={4}>{details.polymer_name}</Title>
            <Paragraph className="Content">
                <Text>Base Material</Text>
                <Text>{details.base_material}</Text>
            </Paragraph>
            <Divider />

            <Title level={4} >Cure Conditions</Title>
            <Divider />
            <Paragraph className="Content">
                <Text>Post Cure - Temperature( degree C)</Text>
                <Text>{details.cure_conditions.post_cure_degC}</Text>
            </Paragraph>
            <Divider />
            <Paragraph className="Content">
                <Text>Post Cure - Time( Hrs)</Text>
                <Text>{details.cure_conditions.post_cure_timeHrs}</Text>
            </Paragraph>
            <Divider />
            <Paragraph className="Content">
                <Text>Press Cure - Temperature( degree C)</Text>
                <Text>{details.cure_conditions.press_cure_degC}</Text>
            </Paragraph>
            <Divider />
            <Paragraph className="Content">
                <Text>Press Cure - Time( Min)</Text>
                <Text>{details.cure_conditions.press_cure_timeMin}</Text>
            </Paragraph>
            <Divider />

            <Title level={4} >Formulation Components</Title>
            <Divider />
            <Paragraph className="Content">
                <Text>MT-Carbon(N990)</Text>
                <Text>{details.formulation_components.mt_carbon_n990}</Text>
            </Paragraph>
            <Divider />
            <Paragraph className="Content">
                <Text>Perkadox 14 (100%)</Text>
                <Text>{details.formulation_components.perkadox_14_100_pct}</Text>
            </Paragraph>
            <Divider />
            <Paragraph className="Content">
                <Text>Polymer</Text>
                <Text>{details.formulation_components.polymer}</Text>
            </Paragraph>
            <Divider />
            <Paragraph className="Content">
                <Text>Sodium Stearate</Text>
                <Text>{details.formulation_components.sodium_stearate}</Text>
            </Paragraph>
            <Divider />
            <Paragraph className="Content">
                <Text>TAIC (100%) Liquid</Text>
                <Text>{details.formulation_components.taic_100_pct_liquid}</Text>
            </Paragraph>
            <Divider />
            <Paragraph className="Content">
                <Text>Formula ID</Text>
                <Text>{details.formulation_id}</Text>
            </Paragraph>
            <Divider />

            <Title level={4} >Properties</Title>
            <Divider />
            <Paragraph>
                <Text>100% Modulus (MPa)</Text>
                <Text>{details.properties._100pct_modulus_MPa}</Text>
            </Paragraph>
            <Divider />
            <Paragraph>
                <Text>Compression Set (%) (200 C and 70 Hrs)</Text>
                <Text>{details.properties.compression_set_pct_200degC_X_70hrs}</Text>
            </Paragraph>
            <Divider />

        </div>
    )
}

const columns = [
    {
        title: 'Formulation ID',
        dataIndex: 'formulationid',
        key: 'formulationid',
    },
    {
        title: 'Polymer Brand',
        dataIndex: 'polymerbrand',
        key: 'polymerbrand',
    },
    {
        title: 'Grade',
        dataIndex: 'grade',
        key: 'grade',
    },
];


const FilterBox = () => {
    const inputs = { category: "", subcategory: "", operator: "", uservalue: "" };
    const [filterRows, setFilterRows] = useState([inputs]);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [resultErr, setResultErr] = useState("");
    const [currRow, setCurrRow] = useState(null);
    const [isSelected, setIsSelected] = useState("");
    const [dataSource, setDataSource] = useState([]);

    const handleClickRow = (formulation_id) => {
        const details = results.filter(data => data.formulation_id === formulation_id)[0];
        console.log(formulation_id, details);

        setCurrRow(details);
        // setIsSelected(formulation_id);
    }

    const handleAddFilter = () => {
        setFilterRows([...filterRows, inputs])
    }
    const handleCatChange = (value, i) => {
        const rows = [...filterRows];
        rows[i]["category"] = value;
        setFilterRows(rows);
    };
    const handleSubCatChange = (value, i) => {
        const rows = [...filterRows];
        rows[i]["subcategory"] = value;
        setFilterRows(rows);
    };
    const handleOperatorChange = (value, i) => {
        const rows = [...filterRows];
        rows[i]["operator"] = value;
        setFilterRows(rows);
    };
    const handleChange = (e, i) => {
        const { name, value } = e.target;
        // console.log(name, value, i);

        const rows = [...filterRows];
        rows[i][name] = value;
        setFilterRows(rows);
    };
    const handleRemoveRow = (index) => {
        const rows = [...filterRows];
        rows.splice(index, 1);
        setFilterRows(rows);
    }
    const handleSearch = () => {
        // console.log(filterRows); return false;
        setIsLoading(true);
        setCurrRow(null);
        setResults([]);
        const filter_array = filterRows.map(rowInput => {
            // if (rowInput.category && rowInput.subcategory && rowInput.operator && rowInput.uservalue)
            return `${rowInput.category}.${rowInput.subcategory},${rowInput.operator},${rowInput.uservalue}`;

        });
        const payload = {
            // filter_array: ["properties.hardness_ShoreA,eq,76", "formulation_components.taic_100_pct_liquid,gt,1"],
            filter_array: filter_array,
            token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiUGxFbnRfMzJTMVg0SVBETSJ9.AeyvpOYjOJrcsZasgno71jJ3pxlRAetYzn_y74feSbXsYWJzJADnhLP9mJ6T-DjbnwmWZgwXrG0vQNDXSx7GyA",
            user_id: "PlEnt_32S1X4IPDM"
        };
        fetch("https://api.sandbox.polymerize.io/v1/data/_filter", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(payload) // body data type must match "Content-Type" header
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data); return false;
                setIsLoading(false);
                if (data.result.error)
                    setResultErr(data.result.error);
                else {
                    setResultErr("");
                    if (data.result.formulation_data === null)
                        setResultErr(data.result.message);
                    else if (data.result.formulation_data.length === 0)
                        setResultErr("No data found.");
                    else
                        setResults(data.result.formulation_data);
                }
            })
            .catch(err => {
                // console.log(err);
                setResultErr(err);

            })
    }


    useEffect(() => {
        const dataset = results.map((res, i) => {
            return {
                key: res.formulation_id,
                formulationid: res.formulation_id,
                polymerbrand: res.polymer_name,
                grade: res.base_material,
            }

        });
        setDataSource(dataset);

    }, [results]);



    return (
        <div style={{ padding: 16 }}>

            {filterRows.map((input, i) => {
                return (
                    <Row key={`row-${i}`} style={{ marginBottom: 8 }}>
                        <Col span={4}>
                            <Select
                                name="category"
                                placeholder="Category"
                                onChange={(value) => handleCatChange(value, i)}
                                style={{ width: "100%" }}
                            >
                                {categories.map((option) => (
                                    <Option key={option.value} value={option.value}>{option.title}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select
                                name="subcategory"
                                placeholder="Sub Category"
                                onChange={(value) => handleSubCatChange(value, i)}
                                style={{ width: "100%" }}
                            >
                                {subcategories[input.category] && subcategories[input.category].map((option) => (
                                    <Option key={option} value={option}>{option}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Select
                                name="operator"
                                placeholder="Operator"
                                onChange={(value) => handleOperatorChange(value, i)}
                                style={{ width: "100%" }}
                            >
                                {operators.map((option) => (
                                    <Option key={option.value} value={option.value}>{option.name}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Input
                                placeholder="Value"
                                name="uservalue"
                                value={input.uservalue}
                                onChange={e => handleChange(e, i)} />
                        </Col>
                        <Col span={4}>
                            <Button onClick={() => handleRemoveRow(i)} danger>Remove</Button>
                        </Col>
                    </Row>
                )
            })}
            <div style={{ display: "flex" }}>
                <Button type="primary" onClick={handleAddFilter} style={{ marginRight: 5 }}>Add Filter</Button>
                {filterRows.length > 0 &&
                    <Button type="primary" onClick={handleSearch} >Search</Button>
                }
            </div>
            {isLoading
                ? <div style={{ padding: 8 }}><Spin /></div>
                :
                <div>
                    <Paragraph>
                        {resultErr}
                    </Paragraph>


                    {dataSource.length > 0 &&
                        <Row >
                            <Col span={16}>
                                <Table
                                    dataSource={dataSource}
                                    columns={columns}
                                    onRow={(r) => ({
                                        onClick: () => handleClickRow(r.formulationid),
                                    })}
                                />
                            </Col>
                            <Col span={8}>
                                {currRow !== null &&
                                    <FormulaDetails details={currRow} />
                                }
                            </Col>
                        </Row>
                    }
                </div>

            }

        </div>
    )
}
export default FilterBox;