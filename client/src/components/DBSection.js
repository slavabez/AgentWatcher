import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { sortIntoCategories } from "../helpers";

const API_URL = `/api/names`;

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

const Input = styled.input`
  width: 90%;
  text-align: center;
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
`;

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
        <Input
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
  const [names, setNames] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(API_URL);
    setNames(res.data);
  };

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
          {names.map(n => (
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
