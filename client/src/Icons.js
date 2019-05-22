import React from "react";
import styled from "styled-components";

const IconWrap = styled.div`
  height: 25px;
  width: 25px;
  background-color: ${p => (p.color ? p.color : "rebeccapurple")};
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: ${p => (p.fill ? p.fill : "white")};
    stroke: ${p => (p.fill ? p.fill : "white")};
  }
`;

export const DownloadIcon = () => {
  return (
    <IconWrap color="#333399">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
      >
        <g>
          <g>
            <path
              d="M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64
			c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472
			c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z"
            />
          </g>
        </g>
        <g>
          <g>
            <path d="M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z" />
          </g>
        </g>
      </svg>
    </IconWrap>
  );
};

export const UploadIcon = () => {
  return (
    <IconWrap color="#993399">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="433.5px"
        height="433.5px"
        viewBox="0 0 433.5 433.5"
      >
        <g>
          <g id="file-upload">
            <polygon points="140.25,331.5 293.25,331.5 293.25,178.5 395.25,178.5 216.75,0 38.25,178.5 140.25,178.5 		" />
            <rect x="38.25" y="382.5" width="357" height="51" />
          </g>
        </g>
      </svg>
    </IconWrap>
  );
};
