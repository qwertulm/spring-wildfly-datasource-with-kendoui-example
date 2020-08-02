
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';

import { MyCommandCell } from './myCommandCell.jsx';
import { ProductsLoader } from './products-loader.jsx';
import PATH from "./consts";

const filterOperators= {
  'text': [
    { text: 'grid.filterStartsWithOperator', operator: 'startswith' },
    { text: 'grid.filterEqOperator', operator: 'eq' },
    { text: 'grid.filterEndsWithOperator', operator: 'endswith' },
    { text: 'grid.filterNotEqOperator', operator: 'neq' },
    { text: 'grid.filterIsNotEmptyOperator', operator: 'isnotempty' },
    { text: 'grid.filterIsNullOperator', operator: 'isnull' },
    { text: 'grid.filterIsNotNullOperator', operator: 'isnotnull' },
    { text: 'grid.filterIsEmptyOperator', operator: 'isempty' },
  ],
  'numeric': [
    { text: 'grid.filterGteOperator', operator: 'gte' },
    { text: 'grid.filterGtOperator', operator: 'gt' },
    { text: 'grid.filterEqOperator', operator: 'eq' },
    { text: 'grid.filterNotEqOperator', operator: 'neq' },
    { text: 'grid.filterLteOperator', operator: 'lte' },
    { text: 'grid.filterLtOperator', operator: 'lt' },
    { text: 'grid.filterIsNullOperator', operator: 'isnull' },
    { text: 'grid.filterIsNotNullOperator', operator: 'isnotnull' }
  ],
  'date': [
    { text: 'grid.filterAfterOrEqualOperator', operator: 'gte' },
    { text: 'grid.filterAfterOperator', operator: 'gt' },
    { text: 'grid.filterEqOperator', operator: 'eq' },
    { text: 'grid.filterNotEqOperator', operator: 'neq' },
    { text: 'grid.filterBeforeOperator', operator: 'lt' },
    { text: 'grid.filterBeforeOrEqualOperator', operator: 'lte' },
    { text: 'grid.filterIsNullOperator', operator: 'isnull' },
    { text: 'grid.filterIsNotNullOperator', operator: 'isnotnull' }
  ],
  'boolean': [
    { text: 'grid.filterEqOperator', operator: 'eq' }
  ]
}
class App extends React.Component {
  editField = "inEdit";
  CommandCell;

  constructor(props) {
    super(props);

    this.CommandCell = MyCommandCell({
      edit: this.enterEdit,
      remove: this.remove,

      add: this.add,
      discard: this.discard,

      update: this.update,
      cancel: this.cancel,

      editField: this.editField
    });

    this.state = {
      dataState: { take: 10, skip: 0 },
      editID: null,
      data: [],
      originalData: [],
      total: 0
    };
  }

  dataStateChange = (e) => {
    this.setState({
      ...this.state,
      dataState: e.data
    });
  }

  dataRecieved = (products) => {
    this.setState({
      ...this.state,
      total: products.total,
      data: products.data,
      originalData: products.data,
    });
  }

  enterEdit = (dataItem) => {
    this.setState({
      data: this.state.data.map(item =>
          item.Id === dataItem.Id ?
              { ...item, inEdit: true } : item
      )
    });
  }

  remove = (dataItem) => {
    const data = [ ...this.state.data ];
    this.removeItem(data, dataItem);
    this.removeItem(this.state.originalData, dataItem);

    fetch(dataItem.__metadata.uri, {method: 'DELETE'});
    this.setState({ data });
  }

  add = async (dataItem) => {
    dataItem.inEdit = undefined;
    dataItem.Discontinued = undefined;

    let _this = this;

    console.log(dataItem);
    await fetch(PATH + "odata/CarModels", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataItem)
    }).then((response) => {
      response.text().then(function (text) {
        let doc = new DOMParser().parseFromString(text, 'text/xml');
        dataItem.Id = doc.getElementsByTagName('d:Id').item(0).textContent;
        _this.state.originalData.unshift(dataItem);
        _this.setState({
          data: [..._this.state.data]
        });
      });
    });

  }

  discard = (dataItem) => {
    const data = [ ...this.state.data ];
    this.removeItem(data, dataItem);

    this.setState({ data });
  }

  update = (newDataItem) => {
    const updatedItem = { ...newDataItem, inEdit: undefined };

    let diffDataItem = {};
    this.state.originalData.forEach((originalDataItem) => {
      if (originalDataItem["Id"] === updatedItem["Id"]) {
        for (let key in originalDataItem) {
          if (originalDataItem[key] !== updatedItem[key]) {
            diffDataItem[key] = updatedItem[key];
          }
        }
      }
    });

    const data = [ ...this.state.data ];

    this.updateItem(data, updatedItem);
    this.updateItem(this.state.originalData, updatedItem);
    fetch(newDataItem.__metadata.uri, {
      method: 'PATCH',
      accept: 'application/json',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(diffDataItem)
    });

    this.setState({ data });
  }

  cancel = (dataItem) => {
    const originalItem = this.state.originalData.find(p => p.Id === dataItem.Id);
    const data = this.state.data.map(item => item.Id === originalItem.Id ? originalItem : item);

    this.setState({ data });
  }

  updateItem = (data, item) => {
    let index = data.findIndex(p => p === item || (item.Id && p.Id === item.Id));
    if (index >= 0) {
      data[index] = { ...item };
    }
  }

  itemChange = (event) => {
    const data = this.state.data.map(item =>
        item.Id === event.dataItem.Id ?
            { ...item, [event.field]: event.value } : item
    );

    this.setState({ data });
  }

  addNew = () => {
    const newDataItem = { inEdit: true, Discontinued: false };

    this.setState({
      data: [ newDataItem, ...this.state.data ]
    });
  }

  render() {
    const { data } = this.state;
    const hasEditedItem = data.some(p => p.inEdit);
    return (
        <div>
        <Grid
            filterable={true}
            sortable={true}
            {...this.state.dataState}
            total={this.state.total}
            data={this.state.data}
            onItemChange={this.itemChange}
            editField={this.editField}
            onDataStateChange={this.dataStateChange}
            filterOperators={filterOperators}
        >
          <GridToolbar>
            <button
                title="Add new"
                className="k-button k-primary"
                onClick={this.addNew}
            >
              Add new
            </button>
          </GridToolbar>
          <Column field="Id" title="Id" filter="numeric"  editable={false} />
          <Column field="Name" title="Name" />
          <Column field="Sku" title="Sku" editor="text" />
          <Column field="Year" title="Year" editor="numeric" filter="numeric" />
          <Column cell={this.CommandCell} filterable={false}/>
        </Grid>
    <ProductsLoader
        dataState={this.state.dataState}
        onDataRecieved={this.dataRecieved}
    />
  </div>
    );
  }

  generateId = data => data.reduce((acc, current) => Math.max(acc, current.Id), 0) + 1;

  removeItem(data, item) {
    let index = data.findIndex(p => p === item || item.Id && p.Id === item.Id);
    if (index >= 0) {
      data.splice(index, 1);
    }
  }
}

ReactDOM.render(
    <App />,
    document.querySelector('my-app')
);

