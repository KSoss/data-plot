import dash
from dash import dcc, html
import plotly.express as px
import pandas as pd

df = pd.DataFrame({
    "Animals": ["Cows", "Chickens", "Horses", "Cows", "Chickens", "Horses"],
    "Amount": [4, 1, 2, 2, 4, 5],
    "City": ["SF", "SF", "SF", "Montreal", "Montreal", "Montreal"]
})

app = dash.Dash(__name__)

app.layout = html.Div(children=[
    html.H1(children='Interactive Data Dashboard'),

    dcc.Graph(
        id='example-graph',
        figure=px.bar(df, x="Animals", y="Amount", color="City", barmode="group")
    )
])

if __name__ == '__main__':
    app.run_server(debug=True)
