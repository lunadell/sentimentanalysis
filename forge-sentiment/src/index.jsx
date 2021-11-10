import ForgeUI,{ render, Fragment, Text, IssuePanel, useEffect, useState, useProductContext} from '@forge/ui';
import api, { route } from "@forge/api";


//Auswertung für alle Issues, aber in jedem Issue für sich
//Alle IssuesID müssen angesprochen werden :)


const App = () => {
const context = useProductContext();
const issueKey = context.platformContext.issueKey;
const [data, setData] = useState("...loading...");
var bodyData = `{
  "expression": "issue.comments.map( c => c.body.plainText).join(' ')",
  "context": {
    "issue": {
      "key": "${issueKey}"
    }
  }
}`;
useEffect(async () => {

  const response = await api.asApp().requestJira(route`/rest/api/2/expression/eval`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyData
    });
  
  const currentValue = await response.json();
  console.log(currentValue);

var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var result = sentiment.analyze(currentValue.value);
  setData(result.score);
}, [])


//result.score
  return (
    <Fragment>
      <Text>sentiment score: {data}

      </Text>
    </Fragment>
  );
};
export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
