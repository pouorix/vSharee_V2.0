import React, { useEffect, useState } from 'react';

import { GroupType, ReduxState, UserData } from 'interface';
import { connect, ConnectedProps } from 'react-redux';
import tvPic from 'assets/images/dashboard/tv.png';
import fakePic from 'assets/images/dashboard/fakepic.jpg';
import './dashboard.style.scss';
import EditProfile from '../Component/editProfile/editProfile.index';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import MyGroupsList from './myGroups/myGroups.index';
import TopGroupsList from './topGroups/topGroups.index';
import MyFriendsList from './myFriends/myfriends.index';
import { get, responseValidator } from '../../scripts/api';
import { APIPath } from '../../data';
import { toast } from 'react-toastify';
import { Console } from 'inspector';

const Dashboard: React.FC<ConnectedProps<typeof connector>> = function (props: ConnectedProps<typeof connector>) {
    const [view, setView] = useState<'myGroups' | 'topGroups' | 'myFriends'>('myGroups');
    const [offline, setOffline] = useState<UserData[] | undefined>(undefined);
    const [online, setOnline] = useState<UserData[] | undefined>(undefined);
    const [topGroup, setTopGroup] = useState<GroupType[] | undefined>(undefined);

    useEffect(() => {
        get<any>('/notifications/').then((res) => {
            if (responseValidator(res.status) && res.data) {
                // if (NotificationType.Follow == res.data){
                //
                // }
            } else {
                toast.error('Something went wrong ');
            }
        });
    }, []);

    useEffect(() => {
        get<UserData[]>(APIPath.user.offline).then((res) => {
            if (responseValidator(res.status) && res.data) {
                setOffline(res.data);
            } else {
                toast.error('Something went wrong ');
            }
        });

        get<UserData[]>(APIPath.user.online).then((result) => {
            if (responseValidator(result.status) && result.data) {
                setOnline(result.data);
            } else {
                toast.error('Something went wrong ');
            }
        });
        get<GroupType[]>(APIPath.groups.top).then((res) => {
            if (responseValidator(res.status) && res.data) {
                setTopGroup(res.data);
            } else {
                toast.error('Something went wrong ');
            }
        });
    }, []);
    return (
        <div className="vsharee-dashboard-page">
            <div className="my-column">
                <FormControl style={{ marginBottom: '16px' }} className="d-flex d-md-none" variant="outlined">
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={view}
                        onChange={(e: any) => setView(e.target.value)}
                    >
                        <MenuItem value={'myGroups'}>My Groups</MenuItem>
                        <MenuItem value={'topGroups'}>Top Groups</MenuItem>
                        <MenuItem value={'myFriends'}>My Friends</MenuItem>
                    </Select>
                </FormControl>

                <div style={{ padding: 0 }} className=" my-column my-column-left ">
                    <MyGroupsList data={props.myGroups} />
                    <span className="spacer" />
                    <TopGroupsList data={topGroup} />
                </div>
                <div className="d-block d-md-none">
                    {view === 'myFriends' ? (
                        <MyFriendsList online={online} offline={offline} />
                    ) : view === 'myGroups' ? (
                        <MyGroupsList data={props.myGroups} />
                    ) : (
                        <TopGroupsList data={topGroup} />
                    )}
                </div>
            </div>

            <div className="centercolumn">
                <div className="center-items">
                    <img alt="tv" src={tvPic} className="tvPic" />
                    <h2 data-testid="test">Welcome!</h2>
                    <span>This is your brand, shiny server. Here are some steps </span>
                    <h3>to help you et stared:</h3>
                    <div className="p-text">
                        <p>● Create your group</p>
                        <p>● personalize your group with an icon</p>
                        <p>● Invite your friends</p>
                        <p>● Enjoy!</p>
                    </div>
                </div>
            </div>
            <div className="d-none d-md-flex my-column">
                <MyFriendsList offline={offline} online={online} />
            </div>
        </div>
    );
};

const mapStateToProps = (state: ReduxState) => ({
    text: state.language,
    isEdit: state.isEdit,
    myGroups: state.myGroups,
});

const connector = connect(mapStateToProps);
export default connector(Dashboard);
