import { Card, CardContent, Grid, Typography } from "@material-ui/core";

export const renderDisplayCard = ({ key, value, index, Color }) => (
  <Grid item xs={6} sm={3} key={index}>
    <Card raised={true}>
      <CardContent>
        <Grid container>
          <Grid
            item
            xs='auto'
            style={{ background: Color, paddingRight: "5px" }}></Grid>
          <Grid item xs={11}>
            <Typography
              variant='body1'
              component='h6'
              align='center'
              color='textSecondary'
              gutterBottom={true}>
              {key}
            </Typography>
            <Typography
              variant='h5'
              component='h5'
              align='center'
              style={{ color: Color }}>
              {value}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </Grid>
);
