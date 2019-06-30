package com.createdpro.vo;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@ConfigurationProperties(prefix = "com.createdpro")
@PropertySource("classpath:conf.properties")
public class PathConf {

    private String MUSIC_PATH;

    private String LYRIC_PATH;

    public PathConf() {
        super();
    }

    public PathConf(String MUSIC_PATH, String LYRIC_PATH) {
        this.MUSIC_PATH = MUSIC_PATH;
        this.LYRIC_PATH = LYRIC_PATH;
    }

    public PathConf getConf(){
        return new PathConf(MUSIC_PATH, LYRIC_PATH);
    }

    public String getMUSIC_PATH() {
        return MUSIC_PATH;
    }

    public void setMUSIC_PATH(String MUSIC_PATH) {
        this.MUSIC_PATH = MUSIC_PATH;
    }

    public String getLYRIC_PATH() {
        return LYRIC_PATH;
    }

    public void setLYRIC_PATH(String LYRIC_PATH) {
        this.LYRIC_PATH = LYRIC_PATH;
    }

    @Override
    public String toString() {
        return "PathConf{" +
                "MUSIC_PATH='" + MUSIC_PATH + '\'' +
                ", LYRIC_PATH='" + LYRIC_PATH + '\'' +
                '}';
    }

}
