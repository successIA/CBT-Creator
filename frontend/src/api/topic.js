import axios from "axios";
import * as constants from "../constants";
import { getConfig } from "../utils/config";

export const fetchTopicsApi = () => {
  return axios.get(`${constants.BASE_API_URL}auth/`);
};

export const createTopicApi = topic => {
  return axios.post(`${constants.BASE_API_URL}auth/`, topic, getConfig());
};

export const fetchTopicApi = slug => {
  return axios.get(`${constants.BASE_TOPIC_DETAIL_URL}${slug}`);
};

export const updateTopicApi = (slug, topic) => {
  return axios.put(
    `${constants.BASE_TOPIC_UPDATE_URL}${slug}/`,
    topic,
    getConfig()
  );
};

export const deleteTopicApi = slug => {
  return axios.delete(`${constants.BASE_TOPIC_DELETE_URL}${slug}/`);
};
