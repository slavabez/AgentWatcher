import React, { useState } from "react";
import styled from "styled-components";

const API_PATH = ``;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Table = styled.table`
  min-width: 80%;
  text-align: center;

  tr:nth-child(even) {
    background-color: #ddd;
  }
`;

const TableHead = styled.thead`
  font-size: 1rem;

  tr {
    font-size: 1rem;
    background-color: #ddd;
    height: 3rem;
  }
`;

const dummySettings = {
  names: [
    {
      id: "123",
      path: "John",
      name: "Джон"
    },
    {
      id: "124",
      path: "Alex",
      name: "Алиикс"
    },
    {
      id: "125",
      path: "Emma",
      name: "Эммс"
    },
    {
      id: "126",
      path: "Peter",
      name: "Петя"
    }
  ]
};

const EditableRow = ({ id, path, name, update }) => {
  // const [isLoading, setLoading] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [newName, setName] = useState(name);

  // The middle cell is either simple text or a small form
  const renderName = !isEditMode ? (
    <td>{name}</td>
  ) : (
    <td>
      <form
        onSubmit={e => {
          e.preventDefault();
          update(id, newName);
          setEditMode(false);
        }}
      >
        <input
          type="text"
          value={newName}
          onChange={e => setName(e.target.value)}
        />
      </form>
    </td>
  );
  const buttonText = isEditMode ? "Сохранить" : "Изменить";

  return (
    <tr>
      <td>{path}</td>
      {renderName}
      <td>
        <button
          onClick={() => {
            setEditMode(!isEditMode);
          }}
        >
          {buttonText}
        </button>
      </td>
    </tr>
  );
};

const DbSection = () => {
  return (
    <Wrapper>
      <h1>Настройки имен</h1>
      <Table>
        <TableHead>
          <tr>
            <th>Папка</th>
            <th>Имя</th>
            <th>Изменить</th>
          </tr>
        </TableHead>
        <tbody>
          {dummySettings.names.map(n => (
            <EditableRow
              key={n.id}
              id={n.id}
              path={n.path}
              name={n.name}
              update={(id, newName) => {
                console.log(`Submit id ${id}, new name ${newName}`);
              }}
            />
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default DbSection;
